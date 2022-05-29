import styled from "styled-components";
interface Props {
  bottom?: number;
  left?: number;
  width?: string;
  height?: string;
  position?: "absolute" | "unset";
}
export const Button = styled.button<Props>`
  ${({ position, left, bottom, width, height }) =>
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
  cursor: pointer;
  :hover {
    background: #bab8b8;
    box-shadow:rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }
  :active {
    background: #1f61d8;
    color: white;
  
  }
`;

export const ImageWrapper = styled.div<Props>`
  position: absolute;
  left: ${({ left }) => left}px;
  bottom: ${({ bottom }) => bottom}px;
`;
