function addEllipses(str: string | null, limit: number): string {
  if (str === null || str.length === 0) {
    return '';
  }
  
  if (str.length > limit) {
    return str.substring(0, limit) + '...';
  }
  
  return str;
}
export default addEllipses