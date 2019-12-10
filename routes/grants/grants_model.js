const db = require("../../database/DbConfig");

module.exports = {
  find,
  findPinnedGrants,
  masterSearch
};

// Function to obtain all grants
function find() {
  return db("grants");
}

// Function to obtain all saved grants for a specific user
function findPinnedGrants(recipientUserId) {
  return db("saved_grants").where({ user_id: recipientUserId });
}

//Function to obtain all grants by different parameters
function masterSearch(state=[], counties=[], amaount=[], eligibility=[], category=[]) { 
    console.log('inside mastersearch function', state, eligibility, category)
        return db('grants as g').innerJoin('users AS u', 'g.user_id','u.id')
                                .innerJoin('regions AS r', 'g.id' , 'r.grant_id')
                                .leftJoin('states AS s', 'r.state_id','=','s.id')
                                .leftJoin('counties AS c', 'r.county_id', 'c.id')
                                .innerJoin('elegibility_grants AS eg', 'g.id', 'eg.grants_id')
                                .innerJoin('elegibility AS e', 'e.id','eg.elegibility_id')
                                .innerJoin('category_grants AS cg', 'g.id', 'cg.grants_id')
                                .innerJoin('category_keys AS ck','ck.id','cg.category_id')
                                .leftJoin('grants_modification_history AS gm', 'gm.grant_id', 'g.id')
                                .select('g.id',
                                        'g.grant_title',
                                        'g.grant_number',
                                        'g.grant_status',
                                        'g.grant_description',
                                        'g.grant_amount',
                                        'g.due_date',
                                        'u.first_name',
                                        'u.last_name',
                                        'u.email',
                                        'u.telephone',
                                        'u.department',
                                        'u.organization_name',
                                        'u.address_one',
                                        'u.address_two',
                                        'u.zip_code',
                                        db.raw('array_agg(DISTINCT s.state_name) as states'),
                                        db.raw('array_agg(DISTINCT e.elegibility_name) as elegibilities'),
                                        db.raw('array_agg(DISTINCT ck.category_name) as categories'),
                                        db.raw('array_agg(DISTINCT gm.modification_description) as history')  //json_agg(to_chart(gm.updated_at, "MM:DD:YYYY"))
                                     )
                                .groupBy('g.id',
                                         'u.first_name',
                                         'u.last_name',
                                         'u.email',
                                         'u.telephone',
                                         'u.department',
                                         'u.organization_name',
                                         'u.address_one',
                                         'u.address_two',
                                         'u.zip_code'
                                )
                                .whereIn('s.id',  state)
                                .orWhereIn('cg.grants_id',  category)
                                .orWhereIn('eg.grants_id',  eligibility)
                                .orderBy('g.id')            
};

