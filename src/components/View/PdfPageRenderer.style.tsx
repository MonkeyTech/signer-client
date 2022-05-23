import styled from "styled-components";

export const size = {
  mobileXS: "280px",
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "768px",
  tablet: "768px",
  laptopS: "864px",
  laptopM: "1024px",
  laptopL: "1440px",
  desktop: "2560px",
};

export const device = {
  mobileXS: `(max-width: ${size.mobileXS})`,
  mobileS: `(max-width: ${size.mobileS})`,
  mobileM: `(max-width: ${size.mobileM})`,
  mobileL: `(max-width: ${size.mobileL})`,
  tablet: `(max-width: ${size.tablet})`,
  laptopS: `(max-width: ${size.laptopS})`,
  laptopM: `(max-width: ${size.laptopM})`,
  laptopL: `(max-width: ${size.laptopL})`,
  desktop: `(max-width: ${size.desktop})`,
  desktopL: `(max-width: ${size.desktop})`,
};

export const Canvas = styled.canvas`
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  direction: ltr;
`;

export const DocumentWrapper = styled.div`
  position: relative;
`;

export const CanvasWrapper = styled.div`
  width: 100%;
  @media ${device.mobileL} {
    width: 100%;
  }
`;
