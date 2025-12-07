import React from "react";
import styled from "styled-components";
import { Droppable } from "@hello-pangea/dnd";
import type { ICard, IColumn } from "../types";
import Card from "./Card";

const Container = styled.div`
  margin: 0;
  background-color: var(--bg-column);
  border-radius: 12px;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  border: 1px solid var(--border-light);
`;

const Header = styled.div`
  padding: 16px 16px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CountBadge = styled.span`
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
`;

const CardListContainer = styled.div<{ $isDraggingOver: boolean }>`
  flex-grow: 1;
  min-height: 100px;
  background-color: ${(props) =>
    props.$isDraggingOver ? "var(--bg-column-hover)" : "inherit"};
  transition: background-color 0.2s ease;
  border-radius: 0 0 12px 12px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 12px 12px 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

interface Props {
  column: IColumn;
  cards: ICard[];
  onDeleteCard: (id: string) => void;
  onEditCard: (card: ICard) => void;
}

const InnerList = React.memo<{
  cards: ICard[];
  onDeleteCard: (id: string) => void;
  onEditCard: (card: ICard) => void;
}>(({ cards, onDeleteCard, onEditCard }) => {
  return (
    <>
      {cards.map((card, index) => (
        <Card
          key={card._id}
          card={card}
          index={index}
          onDelete={onDeleteCard}
          onEdit={onEditCard}
        />
      ))}
    </>
  );
});

InnerList.displayName = "InnerList";

const Column: React.FC<Props> = ({
  column,
  cards,
  onDeleteCard,
  onEditCard,
}) => {
  return (
    <Container>
      <Header>
        <Title>
          {column.title}
          <CountBadge>{cards.length}</CountBadge>
        </Title>
      </Header>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <CardListContainer
            ref={provided.innerRef}
            {...provided.droppableProps}
            $isDraggingOver={snapshot.isDraggingOver}
          >
            <InnerList
              cards={cards}
              onDeleteCard={onDeleteCard}
              onEditCard={onEditCard}
            />
            {provided.placeholder}
          </CardListContainer>
        )}
      </Droppable>
    </Container>
  );
};

export default Column;
