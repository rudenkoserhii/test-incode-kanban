export const checkNextPage = (link: string | undefined, currentPage: number): boolean => {
  if (!link) {
    // If link is undefined, assume there is no next page
    return false;
  }

  // Split the link string into individual links
  const links = link.split(',');

  // Iterate through the links to find the one with rel="last"
  for (const link of links) {
    const [url, rel] = link.split(';').map((part) => part.trim());

    if (rel === 'rel="last"') {
      // Extract the page number from the URL
      const match = url.match(/page=(\d+)/);

      if (match && match[1]) {
        const lastPage = parseInt(match[1], 10);

        // Compare the last page with the current page
        return lastPage !== currentPage;
      }
    }
  }

  // If no link with rel="last" is found, assume there is no next page
  return false;
};
