export const formatDate = (dateStr: string) => {
  const parts = dateStr.split(" ");

  return parts.length >= 2
    ? `${parts[1].toUpperCase()} ${parts[0]}`
    : dateStr.toUpperCase();
};
