import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrivyClient } from '@privy-io/server-auth';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  private privy: PrivyClient;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    this.privy = new PrivyClient(
      this.configService.getOrThrow('PRIVY_APP_ID'),
      this.configService.getOrThrow('PRIVY_APP_SECRET')
    );
  }

  async verifyAndLogin(privyToken: string) {
    try {
      const verifiedClaims = await this.privy.verifyAuthToken(privyToken);
      const walletAddress = verifiedClaims.userId;

      // Hitta eller skapa användare i databasen
      let user = await this.prisma.users.findUnique({
        where: { walletAddress: walletAddress },
      });

      if (!user) {
        // Om användaren inte finns
        user = await this.prisma.users.create({
          // Skapa ny användare
          data: {
            walletAddress: walletAddress,
            name: `User ${walletAddress.slice(0, 6)}`,
          },
        });
      }

      //Skapa JWT
      const payload = {
        sub: user.walletAddress,
        walletAddress: walletAddress,
      };

      const accessToken = await this.jwtService.signAsync(payload);

      return {
        accessToken,
        user: {
          id: user.walletAddress,
          walletAddress,
          name: user.name,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Privy token');
    }
  }
}
