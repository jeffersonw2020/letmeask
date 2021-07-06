import { useState } from 'react'
import ReactModal from 'react-modal';
import { Button } from '../Button';

import deleteImg from '../../assets/images/delete.svg';

import './styles.scss';

type ModalType = {
  image: string;
  title: string;
  description: string;
  buttonExcluir: string;
  typeModalText?: string;
  handleDelete: () => void;
}

export function Modal({
  image,
  title,
  description,
  buttonExcluir,
  typeModalText,
  handleDelete,
}: ModalType) {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      {typeModalText === "encerrar" && (
        <div>
          <Button isOutlined onClick={openModal}>Encerrar sala</Button>
          <ReactModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            className='Modal'
          >
            <img src={image} alt="Interface" />
            <h1>{title}</h1>
            <p>{description}</p>
            <button
              type="button"
              onClick={closeModal}
            >Cancelar</button>
            <button
              type="button"
              onClick={handleDelete}
            >{buttonExcluir}</button>
          </ReactModal>

        </div>
      )}
      {typeModalText === "pergunta" && (
        <div>
          <button
            type="button"
            onClick={openModal}
          >
            <img src={deleteImg} alt="Remover pergunta" />
          </button>
          <ReactModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            className='Modal'
          >
            <img src={image} alt="Interface" />
            <h1>{title}</h1>
            <p>{description}</p>
            <button
              type="button"
              onClick={closeModal}
            >Cancelar</button>
            <button
              type="button"
              onClick={handleDelete}
            >{buttonExcluir}</button>
          </ReactModal>

        </div>
      )}
      {typeModalText === "resposta" && (
        <div>
          <button
            type="button"
            onClick={openModal}
          >
            <img src={deleteImg} alt="Remover pergunta" />
          </button>
          <ReactModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            className='Modal'
          >
            <img src={image} alt="Interface" />
            <h1>{title}</h1>
            <p>{description}</p>
            <button
              type="button"
              onClick={closeModal}
            >Cancelar</button>
            <button
              type="button"
              onClick={handleDelete}
            >{buttonExcluir}</button>
          </ReactModal>

        </div>
      )}


    </>


  );
}