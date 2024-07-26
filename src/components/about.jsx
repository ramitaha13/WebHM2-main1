// src/components/About.jsx
import React from "react";
import MainLayout from "../layouts/mainLayout";
import AboutStyle, {
  SectionTitle,
  Paragraph,
  List,
  ListItem,
  Section,
} from "../Style/AboutStyle";

export default function About() {
  return (
    <MainLayout>
      <AboutStyle>
        <Section>
          <SectionTitle>All Rights Reserved</SectionTitle>
          <Paragraph>
            This website and all of its content, including but not limited to
            text, images, graphics, data, and software, are the exclusive
            property of Kareem Zeedan, Rami Taha, Jad Taha, and Mohammed
            Khateeb. All rights reserved. No part of this website may be
            reproduced, distributed, or transmitted in any form or by any means,
            including photocopying, recording, or other electronic or mechanical
            methods, without the prior written permission of the owners, except
            in the case of brief quotations embodied in critical reviews and
            certain other non-commercial uses permitted by copyright law.
          </Paragraph>
          <Paragraph>
            Unauthorized use or duplication of any material on this website
            without express and written permission from the owners is strictly
            prohibited.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>Key Features:</SectionTitle>
          <List>
            <ListItem>
              <strong className="font-semibold">Analyze Excel Files:</strong>{" "}
              Easily import and analyze your Excel files to extract meaningful
              insights and trends.
            </ListItem>
            <ListItem>
              <strong className="font-semibold">Advanced Filtering:</strong>{" "}
              Apply filters based on specific columns to quickly find the data
              you need.
            </ListItem>
            {/* Add other list items here */}
          </List>
        </Section>

        <Section>
          <SectionTitle>Commitment to Quality</SectionTitle>
          <Paragraph>
            We are committed to providing the highest quality video data to our
            users. Our team meticulously curates and verifies content to ensure
            that it meets the highest standards of accuracy and reliability.
            This includes:
          </Paragraph>
          <List>
            <ListItem>
              <strong className="font-semibold">Accurate Data:</strong> All
              video data provided on our website is sourced from reputable and
              verified sources. We ensure the accuracy and reliability of the
              data by conducting thorough checks and validations.
            </ListItem>
            {/* Add other list items here */}
          </List>
        </Section>

        <Section>
          <SectionTitle>User Responsibility</SectionTitle>
          <Paragraph>
            By accessing this website, users agree to respect the intellectual
            property rights of Kareem Zeedan, Rami Taha, and Mohammed Khateeb.
            Users also agree not to engage in any unauthorized activities,
            including but not limited to copying, distributing, or altering any
            content without prior permission.
          </Paragraph>
          <Paragraph>
            Users are encouraged to report any violations of these terms to our
            support team. We take all reports seriously and will take
            appropriate action to protect our intellectual property and maintain
            the integrity of our content.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>Updates to Policy</SectionTitle>
          <Paragraph>
            This policy may be updated from time to time to reflect changes in
            our practices or legal requirements. We encourage users to review
            this policy periodically to stay informed about our terms and
            conditions.
          </Paragraph>
        </Section>
      </AboutStyle>
    </MainLayout>
  );
}
