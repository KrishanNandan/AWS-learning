#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { PhotosStack } from '../lib/photosStack';
import { PhotosStackHandler } from '../lib/photosStackHandler';
import { BucketTagger } from './Tagger';

/**Initializing application */
const app = new cdk.App();

/**Initializing stacks */
const PhotosStackObject = new PhotosStack(app, 'photosalbumstack', {});
new PhotosStackHandler(app, 'photosalbumstackhandler', { bucketArn: PhotosStackObject.bucketArn });

/**using cdk aspects */
const tagger = new BucketTagger('level', 'test');
cdk.Aspects.of(app).add(tagger);