import React from 'react';
import Types from 'prop-types';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import 'prismjs/themes/prism-okaidia.css';

import config from '../../../config.json';

import Page from '../../components/page';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Font from './font';
import Section from './section';

function findFirstImgFromAst(ast) {
  const { tagName, properties, children } = ast;
  if (tagName === 'img') {
    const { src } = properties;
    const parts = src.split('.');
    const format = parts[parts.length - 1];
    if (['jpg', 'jpeg', 'png'].includes(format)) {
      return ast;
    }
  }
  if (!children) {
    return null;
  }
  for (const astChild of children) {
    const img = findFirstImgFromAst(astChild);
    if (img) {
      return img;
    }
  }
  return null;
}

const Article = styled.article`
  margin: 20px;
`;
const Title = styled.h1`
  font-family: ${({ id }) => id}_font;
  font-size: 24px;
  margin: 10px 0;
  color: var(--normal-color);
`;
const Time = styled.time`
  font-family: time_font;
  font-size: 14px;
  color: var(--secondary-color);
`;

const Wrapper = ({ pageContext }) => {
  const { id, html, htmlAst, frontmatter } = pageContext;
  const { create, outdated, title, updates } = frontmatter;
  const firstImg = findFirstImgFromAst(htmlAst);
  return (
    <Page>
      <Helmet>
        <meta name="description" content={title} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${config.site}/${id}`} />
        <meta
          property="og:image"
          content={
            firstImg
              ? `${config.site}/${firstImg.properties.src}`
              : `${config.site}/logo.png`
          }
        />
        <title>{title} - 答案</title>
      </Helmet>
      <Header />
      <Font id={id} />
      <Article>
        <header>
          <Title id={id}>{title}</Title>
          <Time datetime={create}>{create}</Time>
        </header>
        <Section
          id={id}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
      </Article>
      <Footer />
    </Page>
  );
};
Wrapper.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  pageContext: Types.object.isRequired,
};

export default Wrapper;
