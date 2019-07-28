import React from 'react';
import useConfig from '../useConfig';
import defaultTo from 'ramda/es/defaultTo';

const Board = () => {
  const [state] = useConfig();
  const { loading, library, page, path } = state;

  if (!path) {
    return null;
  }

  if (loading) {
    return null;
  }

  if (!library) {
    return null;
  }

  const rows = defaultTo([], library[page]);


  return (
    <div id="section:board" className="board">
      {
        rows.map((row, idx) => (
          <div key={idx} className="row">
            {row.map(([firstTitle, secondTitle], iidx) => (
              <div key={`${idx}-${iidx}`} style={{ display: 'flex' }}>
                <div className="selector">
                  <div>{firstTitle.key}</div>
                  <div>{secondTitle.key}</div>
                </div>
                <div className="tile">
                  <div className="title">
                    <div>
                      <span className="fit">{firstTitle && firstTitle.title}</span>
                    </div>
                  </div>
                  <div className="artist">
                    <div>
                      <span className="fit">{firstTitle && firstTitle.artist}</span>
                    </div>
                  </div>
                  <div className="title">
                    <div>
                      <span className="fit">{secondTitle && secondTitle.title}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      }
    </div>
  );
};

export default Board;
