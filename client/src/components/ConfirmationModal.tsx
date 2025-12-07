import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1100; /* Higher than CardModal */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: var(--bg-surface);
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: var(--shadow-lift);
  animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @keyframes popIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const Content = styled.div`
  padding: 24px;
`;

const Title = styled.h3`
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
`;

const Message = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-secondary);
`;

const Footer = styled.div`
  padding: 16px 24px;
  background-color: var(--bg-body);
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" | "danger" }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  background-color: ${(props) => {
    if (props.$variant === "primary") return "var(--primary-color)";
    if (props.$variant === "danger") return "rgba(239, 68, 68, 0.1)";
    return "transparent";
  }};
  color: ${(props) => {
    if (props.$variant === "primary") return "#fff";
    if (props.$variant === "danger") return "var(--danger-color)";
    return "var(--text-secondary)";
  }};
  border: 1px solid
    ${(props) => {
      if (props.$variant === "primary") return "transparent";
      if (props.$variant === "danger") return "var(--danger-color)";
      return "var(--border-light)";
    }};

  &:hover {
    background-color: ${(props) => {
      if (props.$variant === "primary") return "var(--primary-hover)";
      if (props.$variant === "danger") return "var(--danger-color)";
      return "rgba(0,0,0,0.05)";
    }};
    color: ${(props) => {
      if (props.$variant === "danger") return "#fff";
      return "";
    }};
  }
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Content>
          <Title>{title}</Title>
          <Message>{message}</Message>
        </Content>
        <Footer>
          <Button $variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button $variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

export default ConfirmationModal;
