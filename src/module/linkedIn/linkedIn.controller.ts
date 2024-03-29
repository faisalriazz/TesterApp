import { Controller, Body, Post, Req, Get, Query, UseGuards, Param, Put, Delete, Res } from '@nestjs/common';
import { Response } from 'express';
import { LinkedinService } from 'src/service/linkedIn.service';

@Controller()
export class LinkedInController {
    constructor(private readonly linkedinService: LinkedinService) { }

        @Get('/getAll')
        async getProfileContent(@Res() res: Response): Promise<void> {
          const profileUrl = `https://uk.linkedin.com/company/the-classic-brick-company?trk=organization_guest_main-feed-card_feed-actor-name`;
          const content = await this.linkedinService.scrapeProfileContent(profileUrl);
          res.type('text/html');

      // Send the HTML content in the response
      res.send(content.toString());
    } catch (error) {
      // Handle errors appropriately
      console.error('Error:', error.message);
      //res.status(500).send('Internal Server Error');
    }
        }
    
