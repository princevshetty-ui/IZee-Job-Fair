const LoadingSpinner = ({ className = "w-4 h-4", color = "text-white" }) => {
  return (
    <div className={\`inline-block \${className} border-2 \${color} border-t-transparent rounded-full animate-spin\`}></div>
  )
}

export default LoadingSpinner