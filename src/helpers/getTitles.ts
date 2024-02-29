export const getTitles = (url: string, number: number) =>
  number === 0
    ? url
        .split('github.com/')[1]
        .split('/')[0]
        .split('')
        .map((item, index) => (index === 0 ? item.toUpperCase() : item))
        .join('')
    : url
        .split('github.com/')[1]
        .split('/')[1]
        .split('')
        .map((item, index) => (index === 0 ? item.toUpperCase() : item))
        .join('');
