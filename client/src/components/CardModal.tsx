import React, { useState, useEffect } from "react";
import styled from "styled-components";
import type { ICard, IColumn } from "../types";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: var(--bg-surface);
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  box-shadow: var(--shadow-lift);
  animation: slideIn 0.2s ease-out;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const HeaderTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 24px;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--text-primary);
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-light);
  background: var(--bg-body);
  font-size: 14px;
  color: var(--text-primary);
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(12, 102, 228, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-light);
  background: var(--bg-body);
  font-size: 14px;
  color: var(--text-primary);
  font-family: inherit;
  min-height: 100px;
  resize: vertical;
  line-height: 1.5;

  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 2px rgba(12, 102, 228, 0.2);
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-light);
  background: var(--bg-body);
  font-size: 14px;
  color: var(--text-primary);
  font-family: inherit;
  cursor: pointer;

  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 20px;

  & > * {
    flex: 1;
  }
`;

const Footer = styled.div`
  padding: 16px 24px;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: var(--bg-body);
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" | "danger" }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  background-color: ${(props) => {
    if (props.$variant === "primary") return "var(--primary-color)";
    if (props.$variant === "danger") return "transparent";
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
      if (props.$variant === "danger") return "var(--border-light)";
      return "var(--border-light)";
    }};

  &:hover {
    background-color: ${(props) => {
      if (props.$variant === "primary") return "var(--primary-hover)";
      if (props.$variant === "danger") return "rgba(239, 68, 68, 0.1)";
      return "rgba(0,0,0,0.05)";
    }};
    border-color: ${(props) =>
      props.$variant === "danger" ? "var(--danger-color)" : ""};
    color: ${(props) =>
      props.$variant === "danger" ? "var(--danger-color)" : ""};
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const Tag = styled.span`
  background-color: #e9eaf0;
  color: #172b4d;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RemoveTag = styled.button`
  padding: 0;
  background: none;
  border: none;
  font-size: 14px;
  color: #5e6c84;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    color: #ef4444;
  }
`;

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardData: Partial<ICard>) => void;
  onDelete?: (id: string) => void;
  initialData?: Partial<ICard>;
  columns: IColumn[];
}

const CardModal: React.FC<CardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  columns,
}) => {
  const [formData, setFormData] = useState<Partial<ICard>>({
    title: "",
    description: "",
    columnId: columns[0]?.id || "",
    priority: "Medium",
    tags: [],
    assignee: "",
    dueDate: "",
  });

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...initialData,

          priority: initialData.priority || "Medium",
          tags: initialData.tags || [],
          dueDate: initialData.dueDate
            ? new Date(initialData.dueDate).toISOString().split("T")[0]
            : "",
        });
      } else {
        setFormData({
          title: "",
          description: "",
          columnId: columns[0]?.id || "",
          priority: "Medium",
          tags: [],
          assignee: "",
          dueDate: "",
        });
      }
    }
  }, [isOpen, initialData, columns]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleDelete = () => {
    if (initialData?._id && onDelete) {
      onDelete(initialData._id);
    }
  };

  const handleSubmit = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.assignee ||
      !formData.dueDate ||
      !formData.priority ||
      !formData.columnId
    ) {
      alert("All fields are required!");
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderTitle>
            {initialData?._id ? "Edit Card" : "New Card"}
          </HeaderTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label>Title *</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Implement new login flow"
              autoFocus
            />
          </FormGroup>

          <FormGroup>
            <Label>Description *</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a more detailed description..."
            />
          </FormGroup>

          <Row>
            <FormGroup>
              <Label>Status *</Label>
              <Select
                name="columnId"
                value={formData.columnId}
                onChange={handleChange}
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Priority *</Label>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label>Assignee *</Label>
              <Input
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                placeholder="Type assignee name..."
              />
            </FormGroup>
            <FormGroup>
              <Label>Due Date *</Label>
              <Input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </FormGroup>
          </Row>

          <FormGroup>
            <Label>Tags</Label>
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type tag name and press Enter"
            />
            <TagsContainer>
              {formData.tags?.map((tag, index) => (
                <Tag key={index}>
                  {tag}
                  <RemoveTag onClick={() => removeTag(index)}>
                    &times;
                  </RemoveTag>
                </Tag>
              ))}
            </TagsContainer>
          </FormGroup>
        </ModalBody>

        <Footer>
          {initialData?._id && onDelete && (
            <div style={{ marginRight: "auto" }}>
              <Button $variant="danger" onClick={handleDelete}>
                Delete Card
              </Button>
            </div>
          )}
          <Button $variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button $variant="primary" onClick={handleSubmit}>
            {initialData?._id ? "Save Changes" : "Create Card"}
          </Button>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

export default CardModal;
