const notFound = (req, res) => {
    res.status(404).send('The route does not exist')
}

export default notFound