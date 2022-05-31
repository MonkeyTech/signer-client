import styled from "styled-components";
interface Props {
  bottom?: number;
  left?: number;
}
export const Button = styled.button`
  position: absolute;
  bottom: 40px;
  left: calc(50% - 100px);
  width: 200px;
  padding: 10px;
  @media (max-width: 768px) {
    left: calc(50% - 40px);
    width: 80px;
    padding: 5px;
    bottom: 2%;
  }
  background: black;
  color: #efefef;
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
