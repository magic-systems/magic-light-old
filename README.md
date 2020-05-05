# to boot
1. npm i
2. npm run start

# example code in editor
```
// Make color change to yellow in 1 sec.
await on(255, 255, 0, 1000);
// Make color change to lime in 0.5 sec.
await on(0, 255, 0, 500);
```


# auth

## init

1. amplify init
2. amplify add auth
3. amplify push
4. npm install aws-amplify

# hosting

1. amplify add hosting //PROD (S3 with CloudFront using HTTPS)
2. amplify publish
3. s3のウェブサイトhostingを無効に
4. croudfrontでorigin settingを修正
   * Restrict Bucket Access -> yes
   * Origin Access Identity -> Create a New Identity
   * Grant Read Permissions on Bucket -> Yes, Update Bucket Policy
5. amplify auth update
   * edit redirect url

