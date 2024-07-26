// src/components/Home.jsx
import React from "react";
import MainLayout from "../layouts/mainLayout";
import homePhoto from "../assets/homePhoto.png";
import HomeStyle, {
  TextContent,
  MainTitle,
  SubTitle,
  Paragraph,
  ButtonContainer,
  StartButton,
  HomeImage,
} from "../Style/homeStyle";

export default function Home() {
  return (
    <MainLayout>
      <HomeStyle>
        <TextContent>
          <MainTitle>Welcome to Braude Analyzer</MainTitle>
          <SubTitle>Unlock the Power of Your Data</SubTitle>
          <Paragraph>
            Our platform is designed to simplify the process of working with
            Excel files, offering a comprehensive suite of tools for data
            analysis, filtering, file management, and custom file downloads.
            Whether you're handling large datasets or combining multiple files,
            Excel Analyzer provides an intuitive interface to help you achieve
            your goals efficiently.
          </Paragraph>
          <ButtonContainer>
            <StartButton to="/uploadFile">Let's start</StartButton>
          </ButtonContainer>
        </TextContent>
        <HomeImage src={homePhoto} alt="homePhoto" />
      </HomeStyle>
    </MainLayout>
  );
}
