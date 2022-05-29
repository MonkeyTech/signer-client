import styled from "styled-components";

export const Canvas = styled.canvas`
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  direction: ltr;
`;

export const DocumentWrapper = styled.div`
  position: relative;
`;

export const CanvasWrapper = styled.div`
  width: 100%;
`;
export const PageLayout = styled.div`
  @media (max-width:768px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
  }
`;
