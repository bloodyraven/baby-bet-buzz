export const majPremiereLettre = (pseudo: string) => {
  if (!pseudo) return "";
  return pseudo.charAt(0).toUpperCase() + pseudo.slice(1).toLowerCase();
}