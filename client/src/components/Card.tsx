import React from "react";
import styled from "styled-components";
import { Draggable } from "@hello-pangea/dnd";
import { useAuth } from "../context/AuthContext";
import type { ICard } from "../types";

const DeleteButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-secondary);
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    color: var(--danger-color);
    background-color: rgba(239, 68, 68, 0.1);
  }
`;

const Container = styled.div<{ $isDragging: boolean }>`
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  background-color: var(--bg-surface);
  border: 1px solid
    ${(props) => (props.$isDragging ? "var(--primary-color)" : "transparent")};
  box-shadow: ${(props) =>
    props.$isDragging ? "var(--shadow-lift)" : "var(--shadow-sm)"};
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);

    ${DeleteButton} {
      opacity: 1;
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`;

const Title = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--text-primary);
  word-break: break-word;
`;

const Description = styled.p`
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetadataRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

const Badge = styled.span<{ $color?: string; $bg?: string }>`
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: ${(props) => props.$bg || "rgba(255,255,255,0.1)"};
  color: ${(props) => props.$color || "var(--text-secondary)"};
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
`;

interface Props {
  card: ICard;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (card: ICard) => void;
}

const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case "High":
      return { bg: "rgba(239, 68, 68, 0.2)", color: "#fca5a5" };
    case "Medium":
      return { bg: "rgba(245, 158, 11, 0.2)", color: "#fcd34d" };
    case "Low":
      return { bg: "rgba(16, 185, 129, 0.2)", color: "#6ee7b7" };
    default:
      return { bg: "rgba(148, 163, 184, 0.2)", color: "#cbd5e1" };
  }
};

const Card: React.FC<Props> = React.memo(
  ({ card, index, onDelete, onEdit }) => {
    const { role } = useAuth();
    const isDragDisabled = role === "Viewer";
    const priorityStyle = getPriorityColor(card.priority);

    return (
      <Draggable
        draggableId={card._id}
        index={index}
        isDragDisabled={isDragDisabled}
      >
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            $isDragging={snapshot.isDragging}
            onClick={() => onEdit(card)}
            style={{
              ...provided.draggableProps.style,
            }}
          >
            <Header>
              <Title>{card.title}</Title>
              {role === "Editor" && (
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(card._id);
                  }}
                >
                  ×
                </DeleteButton>
              )}
            </Header>

            {card.description && <Description>{card.description}</Description>}

            {(card.priority || (card.tags && card.tags.length > 0)) && (
              <MetadataRow>
                {card.priority && (
                  <Badge $bg={priorityStyle.bg} $color={priorityStyle.color}>
                    {card.priority}
                  </Badge>
                )}
                {card.tags?.map((tag, i) => (
                  <Badge key={i} $bg="#f1f2f4" $color="#42526e">
                    {tag}
                  </Badge>
                ))}
              </MetadataRow>
            )}

            <Footer>
              {card.assignee && <Tag>👤 {card.assignee}</Tag>}
              {card.dueDate && (
                <Tag>📅 {new Date(card.dueDate).toLocaleDateString()}</Tag>
              )}
            </Footer>
          </Container>
        )}
      </Draggable>
    );
  }
);

export default Card;
