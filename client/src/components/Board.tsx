import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { io } from "socket.io-client";
import Column from "./Column";
import CardModal from "./CardModal";
import ConfirmationModal from "./ConfirmationModal";
import type { ICard, IColumn } from "../types";
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  reorderCards,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useThemeStore } from "../store/themeStore";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-body);
  transition: background-color 0.3s ease;
`;

const Header = styled.div`
  height: 64px;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  background-color: var(--bg-body);
  z-index: 10;
  transition: background-color 0.3s ease;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: var(--primary-color);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
`;

const LogoText = styled.h1`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
`;

const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BoardInfo = styled.div`
  padding: 24px 32px 0;
`;

const BoardTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.5px;
`;

const RoleBadge = styled.span`
  padding: 6px 12px;
  background-color: rgba(128, 128, 128, 0.1);
  color: var(--text-secondary);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--border-light);
  cursor: pointer;
  user-select: none;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  padding: 10px 20px;
  background-color: ${(props) =>
    props.$primary ? "var(--primary-color)" : "transparent"};
  color: ${(props) => (props.$primary ? "#fff" : "var(--text-primary)")};
  border: 1px solid
    ${(props) => (props.$primary ? "transparent" : "var(--border-light)")};
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: ${(props) =>
      props.$primary ? "var(--primary-hover)" : "rgba(128,128,128,0.1)"};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ThemeToggle = styled.button`
  background: transparent;
  border: 1px solid var(--border-light);
  color: var(--text-primary);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(128, 128, 128, 0.1);
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f1f5f9;
  background-image: url("https://i.pravatar.cc/150?u=user");
  background-size: cover;
  border: 2px solid var(--bg-body);
  box-shadow: 0 0 0 1px var(--border-light);
`;

const BoardContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  padding: 32px;
  overflow-x: auto;
  gap: 24px;
  width: 100%;

  & > * {
    flex: 1;
    min-width: 280px;
  }

  &::-webkit-scrollbar {
    height: 12px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(128, 128, 128, 0.2);
    border-radius: 6px;
    border: 3px solid var(--bg-body);
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(128, 128, 128, 0.3);
  }
`;

const initialColumns: IColumn[] = [
  { id: "To Do", title: "To Do" },
  { id: "In Progress", title: "In Progress" },
  { id: "Done", title: "Done" },
];

const Board: React.FC = () => {
  const [cards, setCards] = useState<ICard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ICard | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);

  const { role } = useAuth();
  const { theme, toggleTheme } = useThemeStore();

  const fetchCards = async () => {
    try {
      const data = await getCards();
      setCards(data);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const socket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:4000"
    );

    fetchCards();

    socket.on("cardUpdated", (data: ICard) => {
      setCards((prev) => {
        if (prev.find((c) => c._id === data._id)) {
          return prev.map((c) => (c._id === data._id ? data : c));
        }
        return [...prev, data];
      });
    });

    socket.on("cardDeleted", (id: string) => {
      setCards((prev) => prev.filter((c) => c._id !== id));
    });

    socket.on("boardUpdated", () => {
      fetchCards();
    });

    return () => {
      socket.off("cardUpdated");
      socket.off("cardDeleted");
      socket.off("boardUpdated");
      socket.disconnect();
    };
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let newCards = Array.from(cards);
    const cardMoved = newCards.find((c) => c._id === draggableId);
    if (!cardMoved) return;

    newCards = newCards.filter((c) => c._id !== draggableId);

    const updatedCard = { ...cardMoved, columnId: destination.droppableId };

    const destColumnCards = newCards
      .filter((c) => c.columnId === destination.droppableId)
      .sort((a, b) => a.order - b.order);

    destColumnCards.splice(destination.index, 0, updatedCard);

    const sourceColumnId = source.droppableId;
    const destColumnId = destination.droppableId;

    const otherCards = cards.filter((c) => c._id !== draggableId);

    let destCards = otherCards
      .filter((c) => c.columnId === destColumnId)
      .sort((a, b) => a.order - b.order);

    if (sourceColumnId === destColumnId) {
      destCards.splice(destination.index, 0, {
        ...cardMoved,
        columnId: destColumnId,
      } as ICard);
    } else {
      destCards.splice(destination.index, 0, {
        ...cardMoved,
        columnId: destColumnId,
      } as ICard);
    }

    const destCardsWithOrder = destCards.map((c, i) => ({ ...c, order: i }));

    let sourceCardsWithOrder: ICard[] = [];
    if (sourceColumnId !== destColumnId) {
      const sourceCards = otherCards
        .filter((c) => c.columnId === sourceColumnId)
        .sort((a, b) => a.order - b.order);
      sourceCardsWithOrder = sourceCards.map((c, i) => ({ ...c, order: i }));
    }

    const finalCards = [
      ...otherCards.filter(
        (c) => c.columnId !== destColumnId && c.columnId !== sourceColumnId
      ),
      ...destCardsWithOrder,
      ...sourceCardsWithOrder,
    ];

    setCards(finalCards);

    try {
      const destCardIds = destCardsWithOrder.map((c) => c._id);
      await reorderCards(destColumnId, destCardIds);

      if (sourceColumnId !== destColumnId) {
        const sourceCardIds = sourceCardsWithOrder.map((c) => c._id);
        await reorderCards(sourceColumnId, sourceCardIds);
      }
    } catch (error) {
      console.error("Failed to update card", error);
      fetchCards();
    }
  };

  const handleCreateCard = React.useCallback(() => {
    setEditingCard(null);
    setIsModalOpen(true);
  }, []);

  const handleEditCard = React.useCallback((card: ICard) => {
    setEditingCard(card);
    setIsModalOpen(true);
  }, []);

  const handleSaveCard = async (cardData: Partial<ICard>) => {
    if (!cardData.title) return;

    if (editingCard) {
      try {
        const updated = await updateCard(editingCard._id, cardData);
        setCards((prev) =>
          prev.map((c) => (c._id === editingCard._id ? updated : c))
        );
      } catch (err) {
        console.error("Failed to update card", err);
      }
    } else {
      const newCard = {
        ...cardData,
        title: cardData.title,
        columnId: cardData.columnId || "To Do",
        order: cards.filter(
          (c) => c.columnId === (cardData.columnId || "To Do")
        ).length,
      };

      try {
        const savedCard = await createCard(
          newCard as unknown as Omit<ICard, "_id">
        );
        setCards([...cards, savedCard]);
      } catch (err) {
        console.error(err);
      }
    }
    setEditingCard(null);
  };

  const handleDeleteCard = React.useCallback((id: string) => {
    setCardToDelete(id);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDeleteCard = async () => {
    if (!cardToDelete) return;

    try {
      await deleteCard(cardToDelete);
      setCards(cards.filter((c) => c._id !== cardToDelete));

      setIsDeleteModalOpen(false);
      setCardToDelete(null);

      if (isModalOpen) {
        setIsModalOpen(false);
        setEditingCard(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <Header>
        <HeaderLeft>
          <LogoIcon>⟡</LogoIcon>
          <LogoText>Kanban Board</LogoText>
        </HeaderLeft>
        <ControlsGroup>
          <ThemeToggle onClick={toggleTheme}>
            {theme === "dark" ? "🌙" : "☀️"}
          </ThemeToggle>
          {role === "Editor" && (
            <ActionButton $primary onClick={handleCreateCard}>
              + Add New Task
            </ActionButton>
          )}
          <RoleBadge>{role}</RoleBadge>
          <UserAvatar />
        </ControlsGroup>
      </Header>

      <BoardInfo>
        <BoardTitle>Project Phoenix</BoardTitle>
      </BoardInfo>

      <DragDropContext onDragEnd={onDragEnd}>
        <BoardContainer>
          {initialColumns.map((column) => {
            const columnCards = cards
              .filter((c) => c.columnId === column.id)
              .sort((a, b) => a.order - b.order);

            return (
              <Column
                key={column.id}
                column={column}
                cards={columnCards}
                onDeleteCard={handleDeleteCard}
                onEditCard={handleEditCard}
              />
            );
          })}
        </BoardContainer>
      </DragDropContext>

      <CardModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCard(null);
        }}
        onSave={handleSaveCard}
        onDelete={handleDeleteCard}
        initialData={editingCard || undefined}
        columns={initialColumns}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCardToDelete(null);
        }}
        onConfirm={confirmDeleteCard}
        title="Delete Card"
        message="Are you sure you want to delete this card? This action cannot be undone."
      />
    </Layout>
  );
};

export default Board;
