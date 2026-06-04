"use client";

import { useRandomMemory } from "@/app/hooks/useRandomMemory";
import { Button, Card, Flex, Skeleton, Spin, Tooltip, Typography } from "antd";
import Image from "next/image";

export default function MemoryCard() {
  const { memory, isLoading, error, nextMemory  } = useRandomMemory();

  if (isLoading) {
    return <Skeleton active />;
  }
  if (error) {
    return (
      <Typography.Text type="danger">
        Ocorreu um erro ao carregar a memória. Tente novamente mais tarde.
      </Typography.Text>
    )
  }

  const handleClick = () => {
    nextMemory();
  }

  return (
    <Tooltip
      title='Feliz dia dos namorados!'
    >
      <Card
        cover={isLoading ? (
          <Spin size="large" />
          ) : (
            <Image
              alt="Remember when"
              src={memory?.image_url || '@/assets/placeholder.jpg'}
              width={400}
              height={300}
            />
          )
        }
        style={{ width: 350 }}
      >
        <Flex justify='space-between' align="center">
          <Card.Meta
            title="Lembra quando..."
            description={memory?.phrase || "Nenhuma memória encontrada."}
          />
          <Button
            onClick={handleClick}
            loading={isLoading}
          >
            Próxima memória
          </Button>
        </Flex>
      </Card>
    </Tooltip>
  );
}