import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { createWriteStream } from 'fs';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class UploadsResolver {
  @Mutation(() => String)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload,
    @Context() ctx,
  ): Promise<string> {
    const headers = ctx.req.rawHeaders as Array<string>;
    const hostUrl = headers[headers.indexOf('Host') + 1];
    const format = filename.split('.').pop();
    const date = new Date();
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const timeString = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
    const fileName = `${dateString}-${timeString}.${format}`;
    const newFilePath = `/uploads/${fileName}`;
    await new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(`./uploads/${fileName}`))
        .on('finish', () => {
          return resolve(newFilePath);
        })
        .on('error', (error) => {
          console.log(error);
          return reject('error');
        }),
    );
    return `${hostUrl}${newFilePath}`;
  }
}
