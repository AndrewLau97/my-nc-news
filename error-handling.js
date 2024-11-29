exports.psqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request" });
  } 
  else if(err.code==="23503"&&err.detail.includes("article_id")){
    res.status(404).send({message:"Article Id does not exist"})
  }
  else if(err.code==="23503"&&err.detail.includes("author")){
    res.status(404).send({message:"Invalid user, please create an account"})
  }
  else if(err.code==="23503"&&err.detail.includes("topic")){
    res.status(404).send({message:"Topic does not exist"})
  }
  else if(err.code==="23502"){
    res.status(400).send({message:"Missing information"})
  }
  else if(err.code==="23505"&&err.detail.includes("slug")){
    res.status(400).send({message:"Topic already exists"})
  }
  else {
    next(err);
  }
};

exports.customErrors = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

exports.serverError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
