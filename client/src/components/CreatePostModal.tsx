import React from 'react';
import { Modal } from './Modal';
import { CreatePostForm } from './CreatePostForm';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Post">
      <CreatePostForm
        onSuccess={onClose}
        onCancel={onClose}
        showCancel={true}
        className="border-none shadow-none bg-transparent dark:bg-transparent p-0"
      />
    </Modal>
  );
};
