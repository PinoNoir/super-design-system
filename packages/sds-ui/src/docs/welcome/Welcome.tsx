import { Link } from '../../components';
import Azure from '../assets/images/azure.svg';
import Confluence from '../assets/images/confluence.svg';
import Figma from '../assets/images/figma.svg';
import bg from '../assets/images/stretto-bg.png?url';
import Zeroheight from '../assets/images/zeroheight.svg';
import { HeadingTemplate } from '../storybook-components';
import styles from './Welcome.module.css';

export const Welcome = () => {
  return (
    <div
      className={styles.mainContainer}
      style={{
        background: `url(${bg}) no-repeat center center fixed`,
        backgroundSize: 'cover',
      }}
    >
      <div className={styles.content}>
        <HeadingTemplate>Welcome to Cadence Design System</HeadingTemplate>
        <h2>What is CDS?</h2>
        <p>
          Cadence Design System (CDS) is a comprehensive React-based UI toolkit that provides a set of reusable
          components, design patterns, and development utilities. This library was built to empower development teams to
          rapidly build accessible, performant, and visually coherent applications and ensure a unified user experience
          across products.
        </p>
        <p>
          CDS embraces a{' '}
          <Link
            className={styles.link}
            href="https://atomicdesign.bradfrost.com/chapter-2/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Atomic Design
          </Link>{' '}
          methodology, which uses a system of building blocks to create complex interfaces, broken down into:
        </p>
        <ul>
          <li>Primitives: foundational elements like colors and typography</li>
          <li>Atoms: basic UI elements such as buttons and inputs</li>
          <li>Molecules: simple component combinations</li>
          <li>Organisms: more complex, self-contained sections of interfaces</li>
        </ul>
        <p>
          This scalable approach will expand to include comprehensive layouts and page templates. All components are
          built using React and TypeScript, ensuring robust type safety and enhancing the overall developer experience
          through improved code quality and autocompletion.
        </p>
        <div className={styles.subheading}>Internal Resources</div>
        <div className={styles.linkList}>
          <div className={styles.linkItem}>
            <Link href="#" target="_blank">
              <img src={Figma} alt="figma" />
              <span>Figma Library</span>
            </Link>
            <p>Visit Stretto&apos;s Figma component library for visual references.</p>
          </div>
          <div className={styles.linkItem}>
            <Link href="#" target="_blank">
              <img src={Zeroheight} alt="zeroheight" />
              <span>Zeroheight</span>
            </Link>
            <p>Visit our internal docs site for component specs & implementation guides.</p>
          </div>
          <div className={styles.linkItem}>
            <Link href="#" target="_blank">
              <img src={Confluence} alt="confluence" />
              <span>Confluence</span>
            </Link>
            <p>Visit our official Confluence page for updates and other helpful content.</p>
          </div>
          <div className={styles.linkItem}>
            <Link href="#" target="_blank">
              <img src={Azure} alt="azure" />
              <span>Azure Devops</span>
            </Link>

            <p>Head over to our repository in Azure devops to review the source code.</p>
          </div>
        </div>
        <h2>Important Notes</h2>
        <ul>
          <li>
            As we progress on BCC V2 (Phase 2 UI Mod Projects) we will continue to improve our processes, release
            strategy, documentation, and components.
          </li>
          <li>
            For assisstance on any CDS related issues please reach out to the product design team &nbsp;
            <Link className={styles.link} href={'mailto: nickpino.designs@gmail.com'} target="_blank">
              nickpino.designs@gmail.com
            </Link>
            . We will respond promptly to any questions or concerns.
          </li>
          <li>
            For bugs/issues please open a Jira ticket and assign it to Nicholas Pino. Be sure to include screenshots,
            steps to reproduce, and any other relevant information.
          </li>
        </ul>
      </div>
    </div>
  );
};
