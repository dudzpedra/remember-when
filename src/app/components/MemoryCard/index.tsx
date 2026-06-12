"use client";

import { useRandomMemory } from "@/app/hooks/useMemory";
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
        style={{ width: 350, padding: 0, marginTop: 30 }}
      >
        <Card.Meta
          title="Lembra quando..."
          description={memory?.phrase || "Nenhuma memória encontrada."}
        />
      </Card>
    </Tooltip>
  );
}