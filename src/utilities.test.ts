import { addKey, carousel, emptyRows, fill, fillOddRows, getRowAndColumn, keyFromIndex, mapRowAndColToKey, sortByArtist } from './utilities';

describe('utilities', () => {
  describe('fillOddRows', () => {
    it('should return odd array filled', () => {
      expect(
        fillOddRows(['some-artist', [{}]])
      ).toEqual(['some-artist', [{}, { artist: 'some-artist' }]])
    });
    it('should return untouched array with even length', () => {
      expect(
        fillOddRows(['some-artist', [{ key: 1 }, { key: 2 }]])
      ).toEqual(['some-artist', [{ key: 1 }, { key: 2 }]])
    });
  });

  describe('sortByArtist', () => {
    it('should sort by ascending by artist', () => {
      const source = [{ artist: 'b' }, { artist: 'c' }, { artist: 'a', }];
      const expected = [{ artist: 'a' }, { artist: 'b' }, { artist: 'c' }];

      expect(sortByArtist(source)).toEqual(expected)
    });
  });

  describe('getRowAndColumn', () => {
    it('should a row and column value limited by column ', () => {
      expect(getRowAndColumn(6, 0)).toEqual([0, 1])
      expect(getRowAndColumn(6, 1)).toEqual([0, 2])
      expect(getRowAndColumn(6, 2)).toEqual([0, 3])
      expect(getRowAndColumn(6, 3)).toEqual([0, 4])
      expect(getRowAndColumn(6, 4)).toEqual([0, 5])
      expect(getRowAndColumn(6, 5)).toEqual([0, 6])
      expect(getRowAndColumn(6, 6)).toEqual([1, 1])
      expect(getRowAndColumn(6, 7)).toEqual([1, 2])
    });
  });

  describe('mapRowAndColToKey', () => {
    it('should return the ALPHABET character and row', () => {
      expect(mapRowAndColToKey([6, 3])).toEqual('G3');
    });
  })

  describe('emptyRows', () => {
    it('should ten rows of six tiles of two songs.', () => {
      expect(emptyRows).toHaveLength(10);
      emptyRows.forEach(row => {
        expect(row).toHaveLength(6);
        row.forEach(tile => {
          expect(tile).toHaveLength(2)
        });
      });
    });
  });

  describe('fill', () => {
    it('should fill an array up to length with values', () => {
      const f = fill(() => 5, 99);
      const source = [1, 2, 3];

      expect(f(source)).toEqual([1, 2, 3, 99, 99]);
    })

    describe('when length returned is <= than lenght of array', () => {
      it('should return the unaltered source array', () => {
        const f = fill(() => 2, 99);
        const source = [1, 2, 3];

        expect(f(source)).toEqual([1, 2, 3]);
      });
    });
  });

  describe('keyFromIndex', () => {
    it('should return an alphanumeric key', () => {
      expect(
        keyFromIndex(6, 0)
      ).toBe('A1');
    });

    it('should an ALPHA for each column with incrementing numbers', () => {
      const key1 = keyFromIndex(3, 0);
      const key2 = keyFromIndex(3, 1);
      const key3 = keyFromIndex(3, 2);
      const key4 = keyFromIndex(3, 3);
      const key5 = keyFromIndex(3, 4);
      const key6 = keyFromIndex(3, 5);

      expect(key1).toBe('A1');
      expect(key2).toBe('A2');
      expect(key3).toBe('A3');
      expect(key4).toBe('B1');
      expect(key5).toBe('B2');
      expect(key6).toBe('B3');
    });
  });

  describe('addKey', () => {
    it('should set key on each object', () => {
      expect(
        addKey([{}, {}])
      ).toEqual([{ key: keyFromIndex(6, 0) }, { key: keyFromIndex(6, 1) }])
    })

  });

  describe('carousel', () => {
    it('should increment', () => {
      const result = carousel(0, 12, 1, 1);
      expect(result).toBe(2);
    });

    it('should increment by many', () => {
      const result = carousel(0, 12, 1, 4);
      expect(result).toBe(5);
    });

    it('should decrement', () => {
      const result = carousel(0, 12, 1, -1);
      expect(result).toBe(0);
    });

    it('should decrement by many', () => {
      const result = carousel(0, 12, 5, -2);
      expect(result).toBe(3);
    });

    it('should increment to first page', () => {
      const result = carousel(0, 12, 12, 1);
      expect(result).toBe(0);
    });

    it('should decrement to last page', () => {
      const result = carousel(0, 12, 1, -2);
      expect(result).toBe(12);
    });
  });
});
