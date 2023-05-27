# aws s3api command

`Start Localstack`

```bash
localstack start -d
```

&nbsp;

`List` of all buckets

```bash
awslocal s3api list-buckets
```

&nbsp;

`Create` bucket

```bash
awslocal s3api create-bucket --bucket ias
```

&nbsp;

`Put` an object to our created bucket

```bash
awslocal s3api put-object --bucket ias --key example --body sample-file.txt
```

&nbsp;

`Get list` of all object in our created bucket

```bash
awslocal s3api list-objects --bucket ias
```

&nbsp;

`Create new file` from our object

```bash
awslocal s3api get-object --bucket ias --key example create-with-s3.txt
```

&nbsp;

`Delete object`

```bash
awslocal s3api delete-object --bucket ias --key example
```

&nbsp;

`Delete bucket`

```bash
awslocal s3api delete-bucket --bucket ias
```

&nbsp;
