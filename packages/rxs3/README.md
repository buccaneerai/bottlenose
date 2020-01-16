# `rxs3`

`@bottlenose/rxs3` is part of the Bottlenose project.  It allows for the upload and download of s3 files as streams (instead of a single larger HTTP payload). Why?

- This is very important when working with big files. (Even a 1MB file can take significant time to upload.)
- With some filetypes (like CSV, certain JSON formats and audio) this enables processing data immediately even if the full file takes longer to download.
- It is also useful with data streams (audio, big csv files, video, human DNA, etc).
- This approach can conserve memory since only a small chunk of the file needs to be held in memory at any given time.
- This approach can handle connectivity failures. Imagine downloading a big 50GB file and losing connection after downloading 49GB of it.  No fun!
