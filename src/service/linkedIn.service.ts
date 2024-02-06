import { Injectable } from '@nestjs/common';
import { Builder, WebDriver, Capabilities } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import * as cheerio from 'cheerio';

@Injectable()
export class LinkedinService {
  private async createHeadlessChromeDriver(): Promise<WebDriver> {
    const chromeOptions = new chrome.Options();
    chromeOptions.headless(); // Corrected: Use parentheses to invoke the method

    const driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
    return driver;
  }

  public async scrapeProfileContent(profileUrl: string): Promise<string> {
    const driver: WebDriver = await new Builder().forBrowser('chrome').build();; // Use the helper function

    try {
      await driver.get(profileUrl);
  
      try {
        const closeButton = await driver.findElement(driver.By.className('modal__dismiss'));
        await closeButton.click();
        console.log('Modal closed successfully');
      } catch (error) {
        console.error('Error closing the modal:', error.message);
      }
  
      const html = await driver.getPageSource();
      const $ = cheerio.load(html);
  
      // Extract content inside <ul class="updates__list">
      const updatesList = $('.updates__list');
  
      // Extract content from each <li> element
      const extractedContent = [];
      updatesList.find('li').each((index, liElement) => {
        const liContent = $(liElement).html();
  
        // Use cheerio again to parse the <li> content
        const liContent$ = cheerio.load(liContent);
  
        // Extract content from <p class="attributed-text-segment-list__content">
        const attributedTextContent = liContent$('p.attributed-text-segment-list__content').html();
  
        // Extract content from <ul class="grid grid-cols-6 ...">
        const gridContent = liContent$('ul.grid.grid-cols-6').html();
  
        // Check if attributedTextContent and gridContent are not null or undefined
        if (attributedTextContent !== null && gridContent !== null) {
          // Replace data-delayed-url with src in the image tags of gridContent
          const modifiedGridContent = gridContent.replace(/<img [^>]*data-delayed-url=['"]([^'"]*['"])[^>]*>/g, '<img src="$1" width="400" height="400">');
  
          // Replace &amp; with & in the image src attribute
          const finalModifiedGridContent = modifiedGridContent.replace(/&amp;/g, '&');
  
          // Add an h1 tag before each combinedContent with numbering
          const postNumbering = `<h1>LinkedIn Post ${index + 1}</h1>`;
  
          // Combine the extracted content
          const combinedContent = `${postNumbering}\n<li>${attributedTextContent}</li>\n<ul>${finalModifiedGridContent}</ul>\n`;
  
          extractedContent.push(combinedContent);
        } else {
          // If gridContent is null, look for share-native-video
          const shareNativeVideo = liContent$('div.share-native-video.w-main-feed-card-media');
          if (shareNativeVideo.length > 0) {
            // Replace data-sources with src in the video tag
            const videoTag = shareNativeVideo.find('video');
            const videoSources = videoTag.attr('data-sources');
            if (videoSources) {
              const videoSources1 = JSON.parse(videoSources);
  
  // Extract URL, type, width, and height from the first source (you can modify as needed)
  const videoUrl = videoSources1[0].src;
  const videoType = videoSources1[0].type;
  const videoWidth = 400; // Set to desired width
  const videoHeight = 400; // Set to desired height
  
  // Create a new video element
  const newVideoElement = $('<video></video>').prop({
    src: videoUrl,
    type: videoType,
    width: videoWidth,
    height: videoHeight,
    controls: true,
  });
  
  // Replace the existing video tag with the new video element
  shareNativeVideo.replaceWith(newVideoElement);
  
  // Get the updated HTML content
  const videoContent = newVideoElement.prop('outerHTML');
              const postNumbering = `<h1>LinkedIn Post ${index + 1}</h1>`;
              if(attributedTextContent !== null){
                extractedContent.push(`${postNumbering}\n<li>${attributedTextContent}</li>\n<li>${videoContent}</li>\n`);
              }
              else
              extractedContent.push(`${postNumbering}\n${videoContent}`);
            }
          } else if (attributedTextContent !== null) {
            // Include attributedTextContent in the else part if not null
            const postNumbering = `<h1>LinkedIn Post ${index + 1}</h1>`;
            extractedContent.push(`${postNumbering}\n<li>${attributedTextContent}</li>\n`);
          }
        }
      });
      return extractedContent.toString();
  
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      await driver.quit();
    }
  }
  }