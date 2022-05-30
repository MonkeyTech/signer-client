import styled from "styled-components";
interface Props {
  bottom?: number;
  left?: number;
  width?: number;
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
        @media (max-width:768px) {
          width: ${width && width - 20}px;
          left: ${left && left+20}px;
          padding: 5px;
        }
      `
      : `width: 100px;
        padding: 10px;
      `};
  border-radius: 99px;
  border: none;
  cursor: pointer;
  :hover {
    background: #bab8b8;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
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
