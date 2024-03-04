export const checkNextPage = (link: string | undefined, currentPage: number): boolean => {
  if (!link) {
    return false;
  }

  const links = link.split(',');

  for (const link of links) {
    const [url, rel] = link.split(';').map((part) => part.trim());

    if (rel === 'rel="last"') {
      const match = url.match(/page=(\d+)/);

      if (match && match[1]) {
        const lastPage = parseInt(match[1], 10);

        return lastPage !== currentPage;
      }
    }
  }

  return false;
};
