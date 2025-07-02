import Link from '../../components/link/Link';
import { HeadingTemplate } from '../storybook-components';
import styles from './WhyUseCDS.module.css';

export const WhyUseCDS = () => {
  return (
    <>
      <HeadingTemplate>Why use CDS?</HeadingTemplate>
      <div className={styles.main}>
        <h2>Benefits to the Organization</h2>
        <ul className={styles.mainList}>
          <li>Consistent UI across all React applications</li>
          <li>Enhanced developer experience and productivity</li>
          <li>Faster time to market and reduced maintenance costs</li>
          <li>UI patterns are reviewed and approved by the product team</li>
          <li>Gives the product team more ownership over styling and UI patterns</li>
          <li>Improved collaboration between product, QA, and engineering teams</li>
        </ul>

        <h2>Enhances the Development Process</h2>
        <ul className={styles.mainList}>
          <li>Easy installation via NPM packages</li>
          <li>Built in TypeScript&mdash;providing type safety and autocompletion</li>
          <li>Pre-bundled styling for each component</li>
          <li>Comprehensive Storybook examples with API documentation</li>
          <li>Allows development teams to build prototypes/POCs much faster</li>
          <li>Flexible and extendable to fit specific needs</li>
          <li>Actively maintained by design and engineering teams</li>
        </ul>

        <h2>Technical Advantages</h2>
        <ul className={styles.mainList}>
          <li>Clear separation of UI elements from business logic</li>
          <li>Enhanced reusability, maintainability, and testability</li>
          <li>Follows latest WCAG guidelines for accessibility</li>
          <li>Compatible with all React 18 projects</li>
          <li>Fully responsive components built with a mobile-first approach</li>
          <li>Packages are optimized for performance (tree-shaking + code-splitting)</li>
          <li>Reduces dependence on 3rd party libraries</li>
        </ul>

        <h2>Future Plans</h2>
        <ul className={styles.mainList}>
          <li>Continuous addition of new components and features</li>
          <li>Will support theming for different applications</li>
          <li>Improved documentation and usage examples</li>
          <li>More unit test coverage for quality assurance</li>
          <li>Ongoing performance optimization of the cds-ui package</li>
        </ul>

        <p>
          Please checkout our{' '}
          <Link className={styles.link} href={'#'} target="_blank">
            FAQ
          </Link>{' '}
          page on Confluence for more information about CDS and design systems.
        </p>
      </div>
    </>
  );
};
