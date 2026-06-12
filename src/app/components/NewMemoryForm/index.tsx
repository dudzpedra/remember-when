/**
 * NewMemoryForm Component
 * Handles memory creation with image upload and text input
 * Provides real-time validation and user feedback
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
  Form,
  Input,
  Button,
  Upload,
  Card,
  Space,
  Alert,
  Typography,
  Progress,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';
import { useCreateMemory } from '@/app/hooks/useMemory';
import { CreateMemoryPayload } from '@/types/memory';

const { TextArea } = Input;
const { Text } = Typography;

interface NewMemoryFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface FormValues {
  phrase: string;
  imageFile: UploadFile[];
}

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validates image file
 * @param file - File to validate
 * @returns Error message or empty string if valid
 */
const validateImageFile = (file: RcFile): string => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Apenas arquivos JPEG, PNG, WebP e GIF são permitidos';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'O arquivo deve ser menor que 5MB';
  }

  return '';
};

/**
 * Formats file size for display
 * @param bytes - Size in bytes
 * @returns Formatted string
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const NewMemoryForm: React.FC<NewMemoryFormProps> = ({
  onSuccess,
  onError,
}) => {
  const [form] = Form.useForm<FormValues>();
  const { mutate: createMemory, isPending, isError, error, data } = useCreateMemory();
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Handles file before upload
   * Validates and prevents actual upload (we handle it in form submission)
   */
  const beforeUpload = useCallback((file: RcFile): boolean => {
    const validation = validateImageFile(file);

    if (validation) {
      message.error(validation);
      return false;
    }

    return true;
  }, []);

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        if (!values.imageFile || values.imageFile.length === 0) {
          message.error('Por favor, selecione uma imagem');
          return;
        }

        const imageFile = values.imageFile[0].originFileObj;

        if (!imageFile) {
          message.error('Erro ao processar arquivo');
          return;
        }

        const payload: CreateMemoryPayload = {
          phrase: values.phrase.trim(),
          imageFile,
        };
        console.log('payload', payload);

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const next = prev + Math.random() * 30;
            return Math.min(next, 90);
          });
        }, 200);

        const response = await createMemory(payload);

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (response.success) {
          message.success('Memória criada com sucesso!');
          form.resetFields();
          setUploadProgress(0);
          onSuccess?.();
        } else {
          throw new Error(response.error?.message || 'Erro desconhecido');
        }
      } catch (err) {
        setUploadProgress(0);
        const error = err instanceof Error ? err : new Error('Unknown error');
        message.error(error.message);
        onError?.(error);
      }
    },
    [createMemory, form, onSuccess, onError]
  );

  return (
    <Card
      title="Criar Nova Memória"
      styles={{
        title: {
          color: 'var(--foreground)',
        }
      }}
      style={{ 
        width: '100%', 
        backgroundColor: 'var(--surface-strong)', 
        borderColor: 'var(--border)' ,
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ width: '100%', maxWidth: 640 }}
        autoComplete="off"
      >
        {/* Error Alert */}
        {isError && error && (
          <Form.Item>
            <Alert
              title="Erro ao criar memória"
              description={error.message}
              type="error"
              showIcon
              closable
            />
          </Form.Item>
        )}

        {/* Success Alert */}
        {data?.success && (
          <Form.Item>
            <Alert
              title="Sucesso!"
              description="Sua memória foi criada com sucesso"
              type="success"
              showIcon
            />
          </Form.Item>
        )}

        {/* Memory Text Input */}
        <Form.Item
          label="Descrição da Memória"
          name="phrase"
          rules={[
            {
              required: true,
              message: 'Por favor, digite a descrição da memória',
            },
            {
              min: 3,
              message: 'A descrição deve ter no mínimo 3 caracteres',
            },
            {
              max: 500,
              message: 'A descrição não pode ter mais de 500 caracteres',
            },
          ]}
        >
          <TextArea
            placeholder="Descreva sua memória... (máximo 500 caracteres)"
            rows={4}
            disabled={isPending}
            showCount
            maxLength={500}
          />
        </Form.Item>

        {/* Image Upload */}
        <Form.Item
          label="Imagem"
          name="imageFile"
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
          rules={[
            {
              required: true,
              message: 'Por favor, selecione uma imagem',
            },
          ]}
        >
          <Upload
            name="imageFile"
            maxCount={1}
            beforeUpload={beforeUpload}
            accept="image/*"
            disabled={isPending}
          >
            <Button
              icon={<PlusOutlined />}
              disabled={isPending}
            >
              Selecionar Imagem
            </Button>
          </Upload>
        </Form.Item>

        {/* File Info */}
        {form.getFieldValue('imageFile')?.length > 0 && (
          <Form.Item>
            <Space vertical style={{ width: '100%' }}>
              <Text type="secondary">
                Arquivo: {form.getFieldValue('imageFile')[0]?.name}
              </Text>
              <Text type="secondary">
                Tamanho:{' '}
                {formatFileSize(form.getFieldValue('imageFile')[0]?.size || 0)}
              </Text>
            </Space>
          </Form.Item>
        )}

        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <Form.Item>
            <Progress
              percent={Math.round(uploadProgress)}
              status="active"
            />
          </Form.Item>
        )}

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending}
            block
          >
            {isPending ? 'Criando memória...' : 'Criar Memória'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default NewMemoryForm;
