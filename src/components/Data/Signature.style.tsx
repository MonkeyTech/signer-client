import styled from "styled-components";
interface Props {
  bottom?: number;
  left?: number;
  width?: string;
  position?: "absolute" | "unset";
}
export const Button = styled.button<Props>`
  ${({ position, left, bottom, width }) =>
    position === "absolute"
      ? `
        position: ${position};
        left: ${left}px;
        bottom: ${bottom}px;
        width: ${width}px;
      `
      : `width: 100px;`};
  border-radius: 99px;
  border: none;
  padding: 10px;
`;
