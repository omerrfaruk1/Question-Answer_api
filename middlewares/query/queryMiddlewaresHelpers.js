const searchHelper = (searchKey,query,req) => {
     // Search 
     if(req.query.search) {

        const searchObject = {};
        const regex = new RegExp(req.query.search,"i");
        searchObject[searchKey] = regex;

        query = query.where(searchObject);
    }
    return query;
};

const populateHelper = (query,population) => {
    return query.populate(population);
};
const questionSortHelper = (query,req) => {
    
    const sortKey = req.query.sortBy;
    
    if(sortKey === "most-answered"){
       return query = query.sort("-answerCount");
    }
    if(sortKey === "most-liked"){
        return query = query.sort("-likeCount");
    }
    return query = query.sort("-createAt");
    

};
const paginationHelper = async function(totalDocuments,query,req){
    const page = parseInt(req.query.page || 1); 
    const limit = parseInt(req.query.limit || 5);

        const startIndex = (page -1) * limit;
        const endIndex = page  * limit;

        const pagination = {};
        const total = totalDocuments;

        if(startIndex > 0){
            pagination.previous = {
                page: page -1,
                limit: limit
            }
        }
        if(endIndex < total ){
            pagination.next = {
                page: page + 1,
                limit: limit
            }
        }
        return {
        query : query === undefined ? undefined : query.skip(startIndex).limit(limit),  
        pagination : pagination,
        startIndex : startIndex,
        limit : limit
        }
}
module.exports = {
    searchHelper,
    populateHelper,
    questionSortHelper,
    paginationHelper
}