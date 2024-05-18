import { useState } from "react"
import PropTypes from "prop-types"

const ProjectXPChart = ({ projects }) => {
  const projectXP = projects["project-xp"]
  const filteredProjects = projectXP.filter(
    (project) => project.xp !== undefined
  )

  // Filter projects by date
  const currentDate = new Date()
  const startDate = new Date(
    currentDate.getFullYear() - 1,
    currentDate.getMonth(),
    currentDate.getDate()
  )
  const recentProjects = filteredProjects.filter(
    (project) => new Date(project.created) >= startDate
  )

  // Sort filtered projects by time (from oldest to newest)
  recentProjects.sort((a, b) => new Date(a.created) - new Date(b.created))

  // Determine the maximum experience among all projects
  const maxXP = Math.max(...recentProjects.map((project) => project.xp))

  // Determine the height of each bar
  const barHeight = (project) => (project.xp / maxXP) * 100

  // Determine the initial position for each bar on the x-axis
  let startX = 10
  const barWidth = 30 // Width of the bar
  const barMargin = 10 // Margin between bars

  // State for storing project information on hover
  const [hoveredProject, setHoveredProject] = useState(null)
  // State for storing cursor position
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })

  // Mouse over event handler for the bar
  const handleMouseOver = (project, event) => {
    setHoveredProject(project)
    setCursorPosition({ x: event.clientX, y: event.clientY })
  }

  // Mouse out event handler for the bar
  const handleMouseOut = () => {
    setHoveredProject(null)
  }

  return (
    <div className="projectsGraph">
      <div className="graphHeader">
        {" "}
        <h2>Projects</h2>
      </div>
      {hoveredProject && (
        <div
          style={{
            position: "absolute",
            left: cursorPosition.x + 10,
            top: cursorPosition.y + 10,
            backgroundColor: "rgba(27, 27, 27, 0.8)",
            padding: "5px",
            borderRadius: "5px",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
          }}
        >
          <p>Project: {hoveredProject.projectName}</p>
          <p>Date: {new Date(hoveredProject.created).toLocaleDateString()}</p>
        </div>
      )}
      <svg width="900" height="400">
        {recentProjects.map((project) => {
          const height = barHeight(project)
          const y = 400 - height - 30
          const x = startX
          startX += barWidth + barMargin

          return (
            <rect
              key={project.projectName}
              x={x}
              y={y}
              width={barWidth}
              height={height}
              className="bar"
              onMouseOver={(event) => handleMouseOver(project, event)}
              onMouseOut={handleMouseOut}
            />
          )
        })}
      </svg>
    </div>
  )
}

ProjectXPChart.propTypes = {
  projects: PropTypes.shape({
    "project-xp": PropTypes.arrayOf(
      PropTypes.shape({
        projectName: PropTypes.string.isRequired,
        created: PropTypes.string.isRequired,
        xp: PropTypes.number,
      })
    ).isRequired,
  }).isRequired,
}

export default ProjectXPChart
