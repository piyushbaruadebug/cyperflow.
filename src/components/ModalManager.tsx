import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
type ModalType = 'about' | 'careers' | 'blog' | 'press' | 'contact' | null;

interface ModalContextProps {
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  activeModal: ModalType;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = (type: ModalType) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, activeModal }}>
      {children}
      {activeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-sm text-gray-500 hover:text-gray-700">✕</button>
            {activeModal === 'about' && <AboutModal />}
            {activeModal === 'careers' && <CareersModal />}
            {activeModal === 'blog' && <BlogModal />}
            {activeModal === 'press' && <PressModal />}
            {activeModal === 'contact' && <ContactModal />}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within a ModalProvider');
  return context;
};

const ModalHeader = ({ title }: { title: string }) => (
  <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
);

const AboutModal = () => (
  <div>
    <ModalHeader title="About" />
    <p className="text-sm text-gray-700">Placeholder About content.</p>
  </div>
);

const CareersModal = () => (
  <div>
    <ModalHeader title="Careers" />
    <p className="text-sm text-gray-700">Placeholder Careers content.</p>
  </div>
);

const BlogModal = () => (
  <div>
    <ModalHeader title="Blog" />
    <p className="text-sm text-gray-700">Placeholder Blog content.</p>
  </div>
);

const PressModal = () => (
  <div>
    <ModalHeader title="Press" />
    <p className="text-sm text-gray-700">Placeholder Press content.</p>
  </div>
);

const ContactModal = () => (
  <div>
    <ModalHeader title="Contact" />
    <p className="text-sm text-gray-700">Placeholder Contact content.</p>
  </div>
);
