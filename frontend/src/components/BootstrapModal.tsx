import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: React.ReactNode;
}

const BootstrapModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  footer,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = {
    sm: "modal-sm",
    md: "",
    lg: "modal-lg",
    xl: "modal-xl",
  }[size];

  return createPortal(
    <>
      <div
        className="modal-backdrop fade show"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 1050,
        }}
        onClick={onClose}
      />
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1055,
          overflowY: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div
          className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${sizeClass}`}
          style={{
            margin: "auto",
            maxHeight: "calc(100vh - 2rem)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#ffffff",
              opacity: 1,
            }}
          >
            {title && (
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  aria-label="Close"
                ></button>
              </div>
            )}
            <div className="modal-body" style={{ backgroundColor: "#ffffff" }}>
              {children}
            </div>
            {footer && (
              <div className="modal-footer" style={{ backgroundColor: "#ffffff" }}>
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default BootstrapModal;
