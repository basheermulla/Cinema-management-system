const membersBLL = require('../BLL/membersBLL');
const moviesBLL = require('../BLL/moviesBLL');

const getMembersWS = async (req, res) => {
    try {
        // Get members from external WS [jsonplaceholder API]
        const membersWS = await membersBLL.getAllMembersWS();

        // Map received member data to members collection db structure
        const mapMembers = membersWS.map((member) => {
            const random = parseInt(Math.random() * 100);
            return {
                name: member.name,
                email: member.email,
                city: member.address.city,
                image: `https://source.unsplash.com/collection/9948714?${random}`
            }
        });
        
        // Insert mapMembers into members collection
        const result = await membersBLL.addManyMembers(mapMembers);
        // console.log(result);
    } catch (error) {
        console.error(error);
    }
}

const getMoviesWS = async (req, res) => {
    try {
        // Get movies from external WS [tvmaze API]
        const moviesWS = await moviesBLL.getAllMoviesWS();

        // Map received movie data to movies collection db structure
        const mapMovies = moviesWS.map((movie) => {
            return {
                name: movie.name,
                type: movie.type,
                language: movie.language,
                summary: movie.summary,
                image: movie.image,
                genres: movie.genres,
                premiered: movie.premiered,
                rating: movie.rating.average
            }
        });

        // Limit adding data to mongoDB
        const movies = mapMovies.filter((movie, index) => index > 8);

        // Insert mapMovies into movies collection
        const result = await moviesBLL.addManyMovies(movies);
        // console.log(result);
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getMembersWS,
    getMoviesWS
}