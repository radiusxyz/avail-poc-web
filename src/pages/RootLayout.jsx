import React, { useState } from "react";
import styled from "styled-components";
import { Outlet } from "react-router";
import { useTxs } from "../contexts/TxsContext";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  background: #d6ebf2;
  backdrop-filter: blur(4px);
`;

const Head = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #d6ebf2;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70px;
  background: #d6ebf2;
`;

const RootLayout = () => {
  return (
    <Wrapper>
      <Head></Head>
      <Outlet />
      <Footer></Footer>
    </Wrapper>
  );
};

export default RootLayout;
