users table (
id
"firstName",
"lastName",
password text,
membership-status foreign key(membership),

)

messages table (
id
title,
text,
timestamp,
authorId foreign key users(authorid)

)
membership status table (
id
type text,
)
