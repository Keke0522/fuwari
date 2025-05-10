#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <pthread.h>

#define SSDP_ADDR "239.255.255.250"
#define SSDP_PORT 1900
#define BUFFER_SIZE 1024
#define LOCAL_BIND_IP "192.168.1.23" // 替换为你自己的 1 网段 IP

const char *ssdp_message = 
    "YTGS-SEARCH * HTTP/1.1\r\n"
    "HOST: 239.255.255.250:1900\r\n"
    "MAN: \"ssdp:discover\"\r\n"
    "MX: 1\r\n"
    "ST: ssdp:all\r\n\r\n";

const char *ssdp_config_message = 
    "YTGS-CONFIG * HTTP/1.1\r\n"
    "HOST: 239.255.255.250:1900\r\n"
    "MAN: \"ssdp:discover\"\r\n"
    "MX: 1\r\n"
    "ST: ssdp:all\r\n\r\n";

int sockfd;
struct sockaddr_in ssdp_addr;

void *send_loop(void *arg) {
    while (1) {
        if (sendto(sockfd, ssdp_message, strlen(ssdp_message), 0,
                   (struct sockaddr*)&ssdp_addr, sizeof(ssdp_addr)) < 0) {
            perror("sendto YTGS-SEARCH failed");
        }

        if (sendto(sockfd, ssdp_config_message, strlen(ssdp_config_message), 0,
                   (struct sockaddr*)&ssdp_addr, sizeof(ssdp_addr)) < 0) {
            perror("sendto YTGS-CONFIG failed");
        }

        printf("SSDP request sent\n");
        sleep(5);
    }
    return NULL;
}

int main() {
    char buffer[BUFFER_SIZE];
    struct sockaddr_in local_addr;

    // 创建 UDP 套接字
    if ((sockfd = socket(AF_INET, SOCK_DGRAM, 0)) < 0) {
        perror("socket creation failed");
        return 1;
    }

    // 绑定到指定的本地 IP 地址（1 网段）
    memset(&local_addr, 0, sizeof(local_addr));
    local_addr.sin_family = AF_INET;
    local_addr.sin_port = 0; // 任意本地端口
    local_addr.sin_addr.s_addr = inet_addr(LOCAL_BIND_IP);

    if (bind(sockfd, (struct sockaddr*)&local_addr, sizeof(local_addr)) < 0) {
        perror("bind failed");
        close(sockfd);
        return 1;
    }

    // 设置目标 SSDP 地址
    memset(&ssdp_addr, 0, sizeof(ssdp_addr));
    ssdp_addr.sin_family = AF_INET;
    ssdp_addr.sin_port = htons(SSDP_PORT);
    ssdp_addr.sin_addr.s_addr = inet_addr(SSDP_ADDR);

    printf("SSDP YTGS-SEARCH request sent to %s:%d\n", SSDP_ADDR, SSDP_PORT);

    // 创建发送线程
    pthread_t sender_thread;
    if (pthread_create(&sender_thread, NULL, send_loop, NULL) != 0) {
        perror("pthread_create failed");
        close(sockfd);
        return 1;
    }

    // 主线程接收响应
    while (1) {
        socklen_t addr_len = sizeof(ssdp_addr);
        ssize_t recv_size = recvfrom(sockfd, buffer, BUFFER_SIZE, 0,
                                     (struct sockaddr*)&ssdp_addr, &addr_len);
        if (recv_size < 0) {
            perror("recvfrom failed");
            break;
        }

        buffer[recv_size] = '\0';
        printf("Received Device response:\n%s\n", buffer);
    }

    close(sockfd);
    return 0;
}