const letters = "abcdefghijklmnopqrstuvwxyz";

export const generateMeetingId = () => {
  const randomPart = (length) => {
    let result = "";

    for (let i = 0; i < length; i++) {
      result += letters.charAt(
        Math.floor(Math.random() * letters.length)
      );
    }

    return result;
  };

  return `${randomPart(3)}-${randomPart(4)}-${randomPart(3)}`;
};