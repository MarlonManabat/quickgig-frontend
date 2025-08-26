export const toast = {
  success(message: string) {
    if (typeof window !== "undefined") window.alert(message);
    else console.log("SUCCESS:", message);
  },
  error(message: string) {
    if (typeof window !== "undefined") window.alert(message);
    else console.error("ERROR:", message);
  },
};

export default toast;
