import { useState } from 'react';
import {
  Card,
  Grid,
  GridItem,
  Badge,
  Button,
  IconButton,
  Text,
  ProgressBar,
  Avatar,
  Divider,
  SectionAlert,
  Search,
  Icon,
} from '@pinonoir/sds-ui';
import styles from './dashboard.module.css';

// Mock data for the dashboard
const recentActivities = [
  { id: 1, user: 'John Doe', action: 'Completed task', time: '2 hours ago', status: 'completed' },
  { id: 2, user: 'Jane Smith', action: 'Updated document', time: '4 hours ago', status: 'updated' },
  { id: 3, user: 'Bob Johnson', action: 'Created project', time: '6 hours ago', status: 'created' },
  { id: 4, user: 'Alice Williams', action: 'Submitted report', time: '1 day ago', status: 'submitted' },
  { id: 5, user: 'Charlie Brown', action: 'Reviewed code', time: '2 days ago', status: 'reviewed' },
];

const projectData = [
  { id: 1, name: 'Website Redesign', progress: 75, team: 5, status: 'In Progress', deadline: '2025-11-15' },
  { id: 2, name: 'Mobile App', progress: 45, team: 8, status: 'In Progress', deadline: '2025-12-01' },
  { id: 3, name: 'API Integration', progress: 90, team: 3, status: 'Review', deadline: '2025-10-20' },
  { id: 4, name: 'Database Migration', progress: 30, team: 4, status: 'Planning', deadline: '2025-11-30' },
  { id: 5, name: 'Security Audit', progress: 100, team: 2, status: 'Completed', deadline: '2025-10-05' },
];

const statsData = [
  { label: 'Total Projects', value: '24', change: '+12%', trend: 'up' },
  { label: 'Active Users', value: '1,482', change: '+8%', trend: 'up' },
  { label: 'Tasks Completed', value: '367', change: '+23%', trend: 'up' },
  { label: 'Pending Reviews', value: '18', change: '-5%', trend: 'down' },
];

const teamMembers = [
  { id: 1, name: 'John Doe', role: 'Frontend Developer', avatar: 'JD', status: 'online' },
  { id: 2, name: 'Jane Smith', role: 'Backend Developer', avatar: 'JS', status: 'online' },
  { id: 3, name: 'Bob Johnson', role: 'UX Designer', avatar: 'BJ', status: 'away' },
  { id: 4, name: 'Alice Williams', role: 'Project Manager', avatar: 'AW', status: 'offline' },
  { id: 5, name: 'Charlie Brown', role: 'DevOps Engineer', avatar: 'CB', status: 'online' },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'info';
      case 'review':
        return 'warning';
      case 'planning':
        return 'base';
      default:
        return 'base';
    }
  };

  const getActivityBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'updated':
        return 'info';
      case 'created':
        return 'accent';
      case 'submitted':
        return 'success';
      case 'reviewed':
        return 'info';
      default:
        return 'base';
    }
  };

  const getTeamStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'success';
      case 'away':
        return 'warning';
      default:
        return 'base';
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <Text as="h1" className={styles.title}>
              Dashboard
            </Text>
            <Text as="p" className={styles.subtitle}>
              Welcome back! Here's what's happening with your projects today.
            </Text>
          </div>
          <div className={styles.headerActions}>
            <Search
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <Button variant="primary">New Project</Button>
          </div>
        </div>
      </div>

      {/* Alert Section */}
      <div className={styles.alertSection}>
        <SectionAlert
          variant="info"
          message="A new version of the dashboard is available. Click here to update."
          header="System Update"
          hasHeader
        />
      </div>

      {/* Stats Grid */}
      <Grid columns={4} gap="24px" className={styles.statsGrid}>
        {statsData.map((stat, index) => (
          <GridItem key={index} as="div">
            <Card className={styles.statCard}>
              <div className={styles.statCardContent}>
                <Text as="p" className={styles.statLabel}>
                  {stat.label}
                </Text>
                <Text as="h2" className={styles.statValue}>
                  {stat.value}
                </Text>
                <div className={styles.statChange}>
                  <Badge variant={stat.trend === 'up' ? 'success' : 'error'}>{stat.change}</Badge>
                  <Text as="span" className={styles.statTrend}>
                    vs last month
                  </Text>
                </div>
              </div>
            </Card>
          </GridItem>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid columns={3} gap="24px" className={styles.mainContent}>
        {/* Projects Table - Takes 2 columns */}
        <GridItem as="div" colSpan={2}>
          <Card className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <Text as="h3" className={styles.cardTitle}>
                Active Projects
              </Text>
              <Button variant="tertiary" fill="none" size="small">
                View All
              </Button>
            </div>
            <Divider />
            <div className={styles.tableWrapper}>
              <div className={styles.projectTable}>
                <div className={styles.projectTableHeader}>
                  <Text as="span" weight="bold">
                    Project Name
                  </Text>
                  <Text as="span" weight="bold">
                    Progress
                  </Text>
                  <Text as="span" weight="bold">
                    Team
                  </Text>
                  <Text as="span" weight="bold">
                    Status
                  </Text>
                  <Text as="span" weight="bold">
                    Deadline
                  </Text>
                  <Text as="span" weight="bold">
                    Actions
                  </Text>
                </div>
                {projectData.map((project) => (
                  <div key={project.id} className={styles.projectTableRow}>
                    <Text as="span" className={styles.projectName}>
                      {project.name}
                    </Text>
                    <div className={styles.progressCell}>
                      <ProgressBar
                        variant="primary"
                        value={project.progress}
                        max={100}
                        size="sm"
                        className={styles.progressBar}
                      />
                      <Text as="span" className={styles.progressText}>
                        {project.progress}%
                      </Text>
                    </div>
                    <Text as="span">{project.team} members</Text>
                    <Badge variant={getStatusBadgeVariant(project.status)}>{project.status}</Badge>
                    <Text as="span">{project.deadline}</Text>
                    <div className={styles.actionButtons}>
                      <IconButton size="small" variant="tertiary" fill="none" aria-label="Edit project">
                        <Icon name="mdi-pencil" />
                      </IconButton>
                      <IconButton size="small" variant="tertiary" fill="none" aria-label="More options">
                        <Icon name="mdi-dots-vertical" />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </GridItem>

        {/* Team Members - Takes 1 column */}
        <GridItem as="div">
          <Card className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <Text as="h3" className={styles.cardTitle}>
                Team Members
              </Text>
              <Button variant="tertiary" fill="none" size="small">
                Manage
              </Button>
            </div>
            <Divider />
            <div className={styles.teamList}>
              {teamMembers.map((member) => (
                <div key={member.id} className={styles.teamMember}>
                  <div className={styles.memberInfo}>
                    <Avatar size="md" className={styles.avatar}>
                      {member.avatar}
                    </Avatar>
                    <div className={styles.memberDetails}>
                      <Text as="p" className={styles.memberName}>
                        {member.name}
                      </Text>
                      <Text as="p" className={styles.memberRole}>
                        {member.role}
                      </Text>
                    </div>
                  </div>
                  <Badge variant={getTeamStatusBadge(member.status)}>{member.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </GridItem>

        {/* Recent Activity - Takes 2 columns */}
        <GridItem as="div" colSpan={2}>
          <Card className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <Text as="h3" className={styles.cardTitle}>
                Recent Activity
              </Text>
              <Button variant="tertiary" fill="none" size="small">
                View All
              </Button>
            </div>
            <Divider />
            <div className={styles.activityList}>
              {recentActivities.map((activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <Avatar size="sm">
                      {activity.user
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </Avatar>
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityMain}>
                      <Text as="span" className={styles.activityUser}>
                        {activity.user}
                      </Text>
                      <Text as="span" className={styles.activityAction}>
                        {activity.action}
                      </Text>
                    </div>
                    <Text as="span" className={styles.activityTime}>
                      {activity.time}
                    </Text>
                  </div>
                  <Badge variant={getActivityBadgeVariant(activity.status)}>{activity.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </GridItem>

        {/* Quick Actions - Takes 1 column */}
        <GridItem as="div">
          <Card className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <Text as="h3" className={styles.cardTitle}>
                Quick Actions
              </Text>
            </div>
            <Divider />
            <div className={styles.quickActions}>
              <Button variant="secondary" fill="outline" className={styles.actionButton}>
                Create Task
              </Button>
              <Button variant="secondary" fill="outline" className={styles.actionButton}>
                Add Team Member
              </Button>
              <Button variant="secondary" fill="outline" className={styles.actionButton}>
                Schedule Meeting
              </Button>
              <Button variant="secondary" fill="outline" className={styles.actionButton}>
                Generate Report
              </Button>
              <Button variant="secondary" fill="outline" className={styles.actionButton}>
                View Analytics
              </Button>
            </div>
          </Card>
        </GridItem>
      </Grid>
    </div>
  );
}
