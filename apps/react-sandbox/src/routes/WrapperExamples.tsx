import { createFileRoute } from '@tanstack/react-router';
import { Wrapper, Column } from '../components';
import { Card, Container } from 'sds-ui';
import styles from './styles/layout.module.css';

const RouteComponent = () => {
  return <WrapperExamples />;
};

export const Route = createFileRoute('/WrapperExamples')({
  component: RouteComponent,
});

export const WrapperExamples = () => {
  return (
    <div className={styles.appWrapper}>
      <h1>Wrapper Column System Examples</h1>
      {/* Basic 12-column grid example */}
      <Container marginTop="24px">
        <h2>Basic 12-Column Grid</h2>
        <Wrapper cols gap={24}>
          <Column width={{ mobile: 12, tablet: 6, desktop: 6 }}>
            <Card>
              <Card.Title>Half Width</Card.Title>
              <Card.Content>
                <p>This column takes up 6/12 (50%) of the container width</p>
              </Card.Content>
            </Card>
          </Column>
          <Column width={{ mobile: 12, tablet: 6, desktop: 6 }}>
            <Card>
              <Card.Title>Half Width</Card.Title>
              <Card.Content>
                <p>This column takes up 6/12 (50%) of the container width</p>
              </Card.Content>
            </Card>
          </Column>
        </Wrapper>
        <Wrapper cols gap={24}>
          <Column width={{ mobile: 12, tablet: 12, desktop: 4 }}>
            <Card>
              <Card.Title>Third Width</Card.Title>
              <Card.Content>
                <p>This column takes up 4/12 (33.33%) of the container width</p>
              </Card.Content>
            </Card>
          </Column>
          <Column width={{ mobile: 12, tablet: 12, desktop: 4 }}>
            <Card>
              <Card.Title>Third Width</Card.Title>
              <Card.Content>
                <p>This column takes up 4/12 (33.33%) of the container width</p>
              </Card.Content>
            </Card>
          </Column>
          <Column width={{ mobile: 12, tablet: 12, desktop: 4 }}>
            <Card>
              <Card.Title>Third Width</Card.Title>
              <Card.Content>
                <p>This column takes up 4/12 (33.33%) of the container width</p>
              </Card.Content>
            </Card>
          </Column>
          <Column width={{ mobile: 12, tablet: 12, desktop: 3 }}>
            <Card>
              <Card.Title>Quarter Width</Card.Title>
              <Card.Content>
                <p>This column takes up 3/12 (25%) of the container width</p>
              </Card.Content>
            </Card>
          </Column>
          <Column width={{ mobile: 12, tablet: 12, desktop: 3 }}>
            <Card>
              <Card.Title>Quarter Width</Card.Title>
              <Card.Content>
                <p>This column takes up 3/12 (25%) of the container width</p>
              </Card.Content>
            </Card>
          </Column>
          <Column width={{ mobile: 12, tablet: 12, desktop: 3 }}>
            <Card>
              <Card.Title>Quarter Width</Card.Title>
              <Card.Content>
                <p>This column takes up 3/12 (25%) of the container width</p>
              </Card.Content>
            </Card>
          </Column>
          <Column width={{ mobile: 12, tablet: 12, desktop: 3 }}>
            <Card>
              <Card.Title>Quarter Width</Card.Title>
              <Card.Content>
                <p>This column takes up 3/12 (25%) of the container width</p>
              </Card.Content>
            </Card>
          </Column>
        </Wrapper>
      </Container>

      <Container marginTop="24px">
        <h2>Mixed Column Widths</h2>
        <Wrapper cols gap={24}>
          <Column width={8}>
            <Card>
              <Card.Title>Two Thirds Width</Card.Title>
              <Card.Content>
                <p>This column takes up 8/12 (66.67%) of the container width</p>
              </Card.Content>
            </Card>
          </Column>
          <Column width={4}>
            <Card>
              <Card.Title>One Third Width</Card.Title>
              <Card.Content>
                <p>This column takes up 4/12 (33.33%) of the container width</p>
              </Card.Content>
            </Card>
          </Column>

          <Column width={3}>
            <Card>
              <Card.Title>Quarter Width</Card.Title>
              <Card.Content>
                <p>This column takes up 3/12 (25%) of the container width</p>
              </Card.Content>
            </Card>
          </Column>
          <Column width={9}>
            <Card>
              <Card.Title>Three Quarters Width</Card.Title>
              <Card.Content>
                <p>This column takes up 9/12 (75%) of the container width</p>
              </Card.Content>
            </Card>
          </Column>
        </Wrapper>
      </Container>

      {/* Equal-width columns */}
      <Container marginTop="24px">
        <h2>Equal Width Columns</h2>
        <Wrapper cols gap={24}>
          <Column width="equal">
            <Card>
              <Card.Title>Equal Width</Card.Title>
              <Card.Content>
                <p>Auto-sized to take equal space with siblings</p>
              </Card.Content>
            </Card>
          </Column>
          <Column width="equal">
            <Card>
              <Card.Title>Equal Width</Card.Title>
              <Card.Content>
                <p>Auto-sized to take equal space with siblings</p>
              </Card.Content>
            </Card>
          </Column>
          <Column width="equal">
            <Card>
              <Card.Title>Equal Width</Card.Title>
              <Card.Content>
                <p>Auto-sized to take equal space with siblings</p>
              </Card.Content>
            </Card>
          </Column>
        </Wrapper>
      </Container>

      {/* Auto-width columns */}
      <Container marginTop="24px">
        <h2>Auto-Width Columns</h2>
        <Wrapper cols gap={24}>
          <Column width="auto">
            <Card>
              <Card.Title>Auto Width</Card.Title>
              <Card.Content>
                <p>Sized based on content</p>
              </Card.Content>
            </Card>
          </Column>
          <Column width="auto">
            <Card>
              <Card.Title>Takes Remaining Space</Card.Title>
              <Card.Content>
                <p>This column takes all the remaining space after the auto-width column</p>
              </Card.Content>
            </Card>
          </Column>
        </Wrapper>
      </Container>

      {/* Column alignment examples */}
      <Container marginTop="24px">
        <h2>Column Alignment</h2>
        <Wrapper cols gap={24} style={{ minHeight: '200px', border: '1px dashed #ccc', padding: '24px' }}>
          <Column width={4} align="start">
            <Card>
              <Card.Title>Align Start</Card.Title>
              <Card.Content>
                <p>This column aligns to the top</p>
              </Card.Content>
            </Card>
          </Column>
          <Column width={4} align="center">
            <Card>
              <Card.Title>Align Center</Card.Title>
              <Card.Content>
                <p>This column aligns to the center</p>
              </Card.Content>
            </Card>
          </Column>
          <Column width={4} align="end">
            <Card>
              <Card.Title>Align End</Card.Title>
              <Card.Content>
                <p>This column aligns to the bottom</p>
              </Card.Content>
            </Card>
          </Column>
        </Wrapper>
      </Container>

      {/* Dashboard layout example */}
      <Container marginTop="24px">
        <h2>Dashboard Layout Example</h2>
        <Wrapper cols gap={24}>
          {/* Full-width header */}
          <Column width={12}>
            <Card>
              <Card.Title>Dashboard Header</Card.Title>
              <Card.Content>
                <p>Full-width header area (12/12 columns)</p>
              </Card.Content>
            </Card>
          </Column>

          {/* Sidebar and main content */}
          <Column width={4}>
            <Card>
              <Card.Title>Sidebar</Card.Title>
              <Card.Content>
                <p>Mobile: Full width</p>
                <p>Tablet: 4/12 width</p>
                <p>Desktop: 3/12 width</p>
              </Card.Content>
            </Card>
          </Column>

          <Column width={8}>
            <Card>
              <Card.Title>Main Content Area</Card.Title>
              <Card.Content>
                <p>Mobile: Full width</p>
                <p>Tablet: 8/12 width</p>
                <p>Desktop: 9/12 width</p>

                {/* Nested columns for main area */}
                <Wrapper cols gap={24} style={{ marginTop: '24px' }}>
                  <Column width={6}>
                    <Card>
                      <Card.Title>Content Section 1</Card.Title>
                      <Card.Content>
                        <p>Half width of the main content area</p>
                      </Card.Content>
                    </Card>
                  </Column>
                  <Column width={6}>
                    <Card>
                      <Card.Title>Content Section 2</Card.Title>
                      <Card.Content>
                        <p>Half width of the main content area</p>
                      </Card.Content>
                    </Card>
                  </Column>
                </Wrapper>
              </Card.Content>
            </Card>
          </Column>

          {/* Full-width footer */}
          <Column width={12}>
            <Card>
              <Card.Title>Dashboard Footer</Card.Title>
              <Card.Content>
                <p>Full-width footer area (12/12 columns)</p>
              </Card.Content>
            </Card>
          </Column>
        </Wrapper>
      </Container>
    </div>
  );
};
