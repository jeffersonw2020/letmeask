import { ReactNode } from 'react'

import './styles.scss';

type AnsweredProps = {
  answered: {
    id: string;
    content: string;
    author: {
      name: string;
      avatar: string;
    }
  } | undefined;
  children?: ReactNode;
}

export function Answered({
  answered,
  children,
}: AnsweredProps) {
  return (
    <>
      {answered?.content ? (
        <div
          className={`answer`}>
          <p>{answered?.content}</p>
          <footer>
            <div className="user-info">
              <img src={answered?.author.avatar} alt={answered?.author.name} />
              <span>{answered?.author.name}</span>
            </div>
            <div>
              {children}
            </div>
          </footer>
        </div>
      ) : (

        <div></div>

      )}

    </>
  );
}